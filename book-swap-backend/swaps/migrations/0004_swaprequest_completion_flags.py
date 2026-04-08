from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('swaps', '0003_swapmessage'),
    ]

    operations = [
        migrations.AddField(
            model_name='swaprequest',
            name='owner_marked_completed',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='swaprequest',
            name='requester_marked_completed',
            field=models.BooleanField(default=False),
        ),
    ]
